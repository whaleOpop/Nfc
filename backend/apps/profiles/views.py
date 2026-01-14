"""
Views for profiles app
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import (
    MedicalProfile,
    Allergy,
    ChronicDisease,
    Medication,
    EmergencyContact,
    DoctorNote
)
from .serializers import (
    MedicalProfileSerializer,
    MedicalProfileCreateSerializer,
    AllergySerializer,
    ChronicDiseaseSerializer,
    MedicationSerializer,
    EmergencyContactSerializer,
    DoctorNoteSerializer
)


class MedicalProfileView(APIView):
    """Get or create medical profile for current user"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get current user's medical profile"""
        try:
            profile = request.user.medical_profile
            serializer = MedicalProfileSerializer(profile)
            return Response(serializer.data)
        except MedicalProfile.DoesNotExist:
            return Response(
                {'error': 'Профиль не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        """Create medical profile for current user"""
        # Check if profile already exists
        if hasattr(request.user, 'medical_profile'):
            return Response(
                {'error': 'Профиль уже существует'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = MedicalProfileCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return Response(
            MedicalProfileSerializer(profile).data,
            status=status.HTTP_201_CREATED
        )

    def put(self, request):
        """Update medical profile"""
        try:
            profile = request.user.medical_profile
        except MedicalProfile.DoesNotExist:
            return Response(
                {'error': 'Профиль не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MedicalProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return Response(MedicalProfileSerializer(profile).data)


# Allergy Views
class AllergyListCreateView(generics.ListCreateAPIView):
    """List and create allergies"""

    serializer_class = AllergySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Allergy.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.medical_profile
        serializer.save(profile=profile)


class AllergyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete allergy"""

    serializer_class = AllergySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Allergy.objects.filter(profile__user=self.request.user)


# Chronic Disease Views
class ChronicDiseaseListCreateView(generics.ListCreateAPIView):
    """List and create chronic diseases"""

    serializer_class = ChronicDiseaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChronicDisease.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.medical_profile
        serializer.save(profile=profile)


class ChronicDiseaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete chronic disease"""

    serializer_class = ChronicDiseaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChronicDisease.objects.filter(profile__user=self.request.user)


# Medication Views
class MedicationListCreateView(generics.ListCreateAPIView):
    """List and create medications"""

    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Medication.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.medical_profile
        serializer.save(profile=profile)


class MedicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete medication"""

    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Medication.objects.filter(profile__user=self.request.user)


# Emergency Contact Views
class EmergencyContactListCreateView(generics.ListCreateAPIView):
    """List and create emergency contacts"""

    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        profile = self.request.user.medical_profile
        serializer.save(profile=profile)


class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete emergency contact"""

    serializer_class = EmergencyContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EmergencyContact.objects.filter(profile__user=self.request.user)


# Doctor Note Views
class DoctorNoteListCreateView(generics.ListCreateAPIView):
    """List and create doctor notes (medical workers only)"""

    serializer_class = DoctorNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Medical workers can see notes they created
        if user.is_medical_worker:
            return DoctorNote.objects.filter(doctor=user)

        # Patients can see notes for their profile
        if user.is_patient and hasattr(user, 'medical_profile'):
            return DoctorNote.objects.filter(profile=user.medical_profile)

        return DoctorNote.objects.none()

    def perform_create(self, serializer):
        # Only medical workers can create notes
        if not self.request.user.is_medical_worker:
            raise permissions.PermissionDenied('Только медработники могут создавать заметки')

        serializer.save(doctor=self.request.user)


class DoctorNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete doctor note"""

    serializer_class = DoctorNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_medical_worker:
            return DoctorNote.objects.filter(doctor=user)

        if user.is_patient and hasattr(user, 'medical_profile'):
            return DoctorNote.objects.filter(profile=user.medical_profile)

        return DoctorNote.objects.none()
