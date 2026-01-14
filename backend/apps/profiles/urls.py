"""
URLs for profiles app
"""
from django.urls import path
from .views import (
    MedicalProfileView,
    AllergyListCreateView,
    AllergyDetailView,
    ChronicDiseaseListCreateView,
    ChronicDiseaseDetailView,
    MedicationListCreateView,
    MedicationDetailView,
    EmergencyContactListCreateView,
    EmergencyContactDetailView,
    DoctorNoteListCreateView,
    DoctorNoteDetailView,
)

app_name = 'profiles'

urlpatterns = [
    # Medical Profile
    path('', MedicalProfileView.as_view(), name='profile'),

    # Allergies
    path('allergies/', AllergyListCreateView.as_view(), name='allergy-list'),
    path('allergies/<uuid:pk>/', AllergyDetailView.as_view(), name='allergy-detail'),

    # Chronic Diseases
    path('chronic-diseases/', ChronicDiseaseListCreateView.as_view(), name='chronic-disease-list'),
    path('chronic-diseases/<uuid:pk>/', ChronicDiseaseDetailView.as_view(), name='chronic-disease-detail'),

    # Medications
    path('medications/', MedicationListCreateView.as_view(), name='medication-list'),
    path('medications/<uuid:pk>/', MedicationDetailView.as_view(), name='medication-detail'),

    # Emergency Contacts
    path('emergency-contacts/', EmergencyContactListCreateView.as_view(), name='emergency-contact-list'),
    path('emergency-contacts/<uuid:pk>/', EmergencyContactDetailView.as_view(), name='emergency-contact-detail'),

    # Doctor Notes
    path('doctor-notes/', DoctorNoteListCreateView.as_view(), name='doctor-note-list'),
    path('doctor-notes/<uuid:pk>/', DoctorNoteDetailView.as_view(), name='doctor-note-detail'),
]
