from rest_framework import serializers

from integrations.rudderstack.models import RudderstackConfiguration


class RudderstackConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RudderstackConfiguration
        fields = ("id", "base_url", "api_key")
