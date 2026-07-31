from django.db import models
from django.db.models import Q


class Release(models.Model):
    version = models.CharField(max_length=32)
    platform = models.CharField(max_length=32, default='macOS')
    architecture = models.CharField(max_length=32, default='Apple Silicon')
    download_url = models.URLField(max_length=2048)
    file_size = models.CharField(max_length=32, blank=True, default='')
    is_active = models.BooleanField(default=False)
    released_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-released_at', '-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['is_active'],
                condition=Q(is_active=True),
                name='core_one_active_release',
            ),
            models.CheckConstraint(
                condition=~Q(version__regex=r'^\s*$'),
                name='core_release_version_not_blank',
            ),
            models.CheckConstraint(
                condition=~Q(download_url__regex=r'^\s*$'),
                name='core_release_download_url_not_blank',
            ),
        ]

    def __str__(self):
        return f'{self.version} ({self.platform}, {self.architecture})'


class ContactMessage(models.Model):
    class Subject(models.TextChoices):
        GENERAL_QUESTION = 'general_question', 'General Question'
        BUG_REPORT = 'bug_report', 'Bug Report'
        FEATURE_REQUEST = 'feature_request', 'Feature Request'
        ACCESSIBILITY_FEEDBACK = 'accessibility_feedback', 'Accessibility Feedback'

    class Status(models.TextChoices):
        NEW = 'new', 'New'
        READ = 'read', 'Read'
        RESOLVED = 'resolved', 'Resolved'

    name = models.CharField(max_length=120)
    email = models.EmailField(max_length=254)
    subject = models.CharField(max_length=40, choices=Subject.choices)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                condition=Q(subject__in=[
                    'general_question',
                    'bug_report',
                    'feature_request',
                    'accessibility_feedback',
                ]),
                name='core_contact_subject_valid',
            ),
            models.CheckConstraint(
                condition=Q(status__in=['new', 'read', 'resolved']),
                name='core_contact_status_valid',
            ),
            models.CheckConstraint(
                condition=~Q(name__regex=r'^\s*$'),
                name='core_contact_name_not_blank',
            ),
            models.CheckConstraint(
                condition=~Q(email__regex=r'^\s*$'),
                name='core_contact_email_not_blank',
            ),
            models.CheckConstraint(
                condition=~Q(message__regex=r'^\s*$'),
                name='core_contact_message_not_blank',
            ),
        ]

    def __str__(self):
        return f'{self.name} - {self.get_subject_display()}'
