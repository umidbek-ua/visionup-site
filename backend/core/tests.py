from django.core.exceptions import ValidationError
from django.db import IntegrityError, connection, transaction
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContactMessage, Release


class ReleaseModelTests(TestCase):
    def test_release_can_be_created(self):
        release = Release.objects.create(
            version='0.1.0',
            download_url='https://example.com/visionup-0.1.0.dmg',
            file_size='25 MB',
            is_active=True,
            released_at=timezone.now(),
        )

        self.assertEqual(release.platform, 'macOS')
        self.assertEqual(release.architecture, 'Apple Silicon')
        self.assertEqual(str(release), '0.1.0 (macOS, Apple Silicon)')

    def test_only_one_active_release_is_allowed(self):
        Release.objects.create(
            version='0.1.0',
            download_url='https://example.com/visionup-0.1.0.dmg',
            is_active=True,
            released_at=timezone.now(),
        )

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Release.objects.create(
                    version='0.1.1',
                    download_url='https://example.com/visionup-0.1.1.dmg',
                    is_active=True,
                    released_at=timezone.now(),
                )


class ContactMessageModelTests(TestCase):
    def test_contact_message_default_status_is_new(self):
        message = ContactMessage.objects.create(
            name='Umid',
            email='example@email.com',
            subject=ContactMessage.Subject.ACCESSIBILITY_FEEDBACK,
            message='Message text',
        )

        self.assertEqual(message.status, ContactMessage.Status.NEW)

    def test_subject_and_status_choices_validate(self):
        message = ContactMessage(
            name='Umid',
            email='example@email.com',
            subject=ContactMessage.Subject.BUG_REPORT,
            status=ContactMessage.Status.READ,
            message='Message text',
        )

        message.full_clean()

        message.subject = 'unknown_subject'
        with self.assertRaises(ValidationError):
            message.full_clean()

        message.subject = ContactMessage.Subject.BUG_REPORT
        message.status = 'unknown_status'
        with self.assertRaises(ValidationError):
            message.full_clean()


class DatabaseConfigurationTests(TestCase):
    def test_database_uses_postgresql(self):
        self.assertEqual(connection.vendor, 'postgresql')


class LatestReleaseAPITests(APITestCase):
    url = '/api/releases/latest/'

    def test_active_release_returns_200(self):
        Release.objects.create(
            version='0.1.0',
            download_url='https://example.com/visionup-0.1.0.dmg',
            file_size='25 MB',
            is_active=True,
            released_at=timezone.now(),
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_active_release_returns_expected_fields(self):
        release = Release.objects.create(
            version='0.1.0',
            download_url='https://example.com/visionup-0.1.0.dmg',
            file_size='25 MB',
            is_active=True,
            released_at=timezone.now(),
        )

        response = self.client.get(self.url)

        self.assertEqual(set(response.data.keys()), {
            'id',
            'version',
            'platform',
            'architecture',
            'download_url',
            'file_size',
            'released_at',
        })
        self.assertEqual(response.data['id'], release.id)
        self.assertEqual(response.data['version'], '0.1.0')
        self.assertNotIn('is_active', response.data)
        self.assertNotIn('created_at', response.data)
        self.assertNotIn('updated_at', response.data)

    def test_no_active_release_returns_404(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Active release not found.')

    def test_post_is_not_allowed(self):
        response = self.client.post(self.url, {})

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class ContactAPITests(APITestCase):
    url = '/api/contact/'

    def valid_payload(self):
        return {
            'name': 'Umid',
            'email': 'example@email.com',
            'subject': ContactMessage.Subject.ACCESSIBILITY_FEEDBACK,
            'message': 'Message text',
        }

    def test_valid_request_returns_201(self):
        response = self.client.post(self.url, self.valid_payload(), format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Your message has been received.')
        self.assertIsInstance(response.data['id'], int)

    def test_valid_request_creates_contact_message(self):
        self.client.post(self.url, self.valid_payload(), format='json')

        self.assertEqual(ContactMessage.objects.count(), 1)
        message = ContactMessage.objects.get()
        self.assertEqual(message.name, 'Umid')
        self.assertEqual(message.email, 'example@email.com')
        self.assertEqual(message.message, 'Message text')

    def test_default_status_is_new(self):
        self.client.post(self.url, self.valid_payload(), format='json')

        message = ContactMessage.objects.get()
        self.assertEqual(message.status, ContactMessage.Status.NEW)

    def test_invalid_email_returns_400(self):
        payload = self.valid_payload()
        payload['email'] = 'invalid-email'

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_blank_name_returns_400(self):
        payload = self.valid_payload()
        payload['name'] = ''

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_whitespace_name_returns_400(self):
        payload = self.valid_payload()
        payload['name'] = '   '

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_blank_message_returns_400(self):
        payload = self.valid_payload()
        payload['message'] = ''

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data)

    def test_whitespace_message_returns_400(self):
        payload = self.valid_payload()
        payload['message'] = '   '

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data)

    def test_invalid_subject_returns_400(self):
        payload = self.valid_payload()
        payload['subject'] = 'unknown_subject'

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('subject', response.data)

    def test_client_status_is_ignored(self):
        payload = self.valid_payload()
        payload['status'] = ContactMessage.Status.RESOLVED

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        message = ContactMessage.objects.get()
        self.assertEqual(message.status, ContactMessage.Status.NEW)

    def test_get_is_not_allowed(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
