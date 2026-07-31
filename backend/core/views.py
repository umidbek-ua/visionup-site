from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Release
from .serializers import ContactMessageCreateSerializer, ReleaseSerializer


@api_view(['GET'])
def latest_release(request):
    release = Release.objects.filter(is_active=True).first()
    if release is None:
        return Response(
            {'detail': 'Active release not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ReleaseSerializer(release)
    return Response(serializer.data)


@api_view(['POST'])
def contact(request):
    serializer = ContactMessageCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    message = serializer.save()
    return Response(
        {
            'message': 'Your message has been received.',
            'id': message.id,
        },
        status=status.HTTP_201_CREATED,
    )
