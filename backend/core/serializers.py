from rest_framework import serializers

from .models import ContactMessage, Release


class ReleaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Release
        fields = (
            'id',
            'version',
            'platform',
            'architecture',
            'download_url',
            'file_size',
            'released_at',
        )


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('id', 'name', 'email', 'subject', 'message')
        read_only_fields = ('id',)

    def validate_name(self, value):
        return self._validate_trimmed_required(value, 'name')

    def validate_email(self, value):
        return self._validate_trimmed_required(value, 'email')

    def validate_message(self, value):
        return self._validate_trimmed_required(value, 'message')

    def create(self, validated_data):
        return ContactMessage.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            subject=validated_data['subject'],
            message=validated_data['message'],
            status=ContactMessage.Status.NEW,
        )

    def _validate_trimmed_required(self, value, field_name):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError(f'{field_name.replace("_", " ").title()} is required.')
        return trimmed
