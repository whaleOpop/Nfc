"""
URLs for NFC app
"""
from django.urls import path
from .views import (
    NFCTagListView,
    NFCTagRegisterView,
    NFCTagScanView,
    NFCTagRevokeView,
    NFCAccessLogListView,
    NFCEmergencyAccessListView,
)

app_name = 'nfc'

urlpatterns = [
    # NFC Tags
    path('tags/', NFCTagListView.as_view(), name='tag-list'),
    path('register/', NFCTagRegisterView.as_view(), name='register'),
    path('scan/', NFCTagScanView.as_view(), name='scan'),
    path('revoke/', NFCTagRevokeView.as_view(), name='revoke'),

    # Logs
    path('access-logs/', NFCAccessLogListView.as_view(), name='access-log-list'),
    path('emergency-accesses/', NFCEmergencyAccessListView.as_view(), name='emergency-access-list'),
]
