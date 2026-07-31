from django.contrib import admin

from .models import ContactMessage, Release


@admin.register(Release)
class ReleaseAdmin(admin.ModelAdmin):
    list_display = ('version', 'platform', 'architecture', 'is_active', 'released_at')
    list_filter = ('is_active', 'platform', 'architecture', 'released_at')
    search_fields = ('version', 'platform', 'architecture', 'download_url')
    ordering = ('-released_at',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'status', 'created_at')
    list_filter = ('status', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
