from rest_framework import serializers

from integrations.pendo.models import PendoConfiguration


class PendoConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendoConfiguration
        fields = ("id", "api_key")
