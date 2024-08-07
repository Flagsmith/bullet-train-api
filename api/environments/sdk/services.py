import uuid
from itertools import chain
from typing import TypeAlias

from django.utils import timezone

from environments.identities.models import Identity
from environments.identities.traits.models import Trait
from environments.models import Environment
from environments.sdk.types import SDKTraitData

IdentityAndTraits: TypeAlias = tuple[Identity, list[Trait]]


def get_transient_identity_and_traits(
    environment: Environment,
    sdk_trait_data: list[SDKTraitData],
) -> IdentityAndTraits:
    """
    Get a transient `Identity` instance with a randomly generated identifier.
    """
    return (
        (
            identity := _get_transient_identity(
                environment=environment,
                identifier=str(uuid.uuid4()),
            )
        ),
        identity.generate_traits(sdk_trait_data, persist=False),
    )


def get_identified_transient_identity_and_traits(
    environment: Environment,
    identifier: str,
    sdk_trait_data: list[SDKTraitData],
) -> IdentityAndTraits:
    """
    Get a transient `Identity` instance.
    If present in storage, it's a previously persisted identity with its traits,
    combined with incoming traits provided to `sdk_trait_data` argument.
    All traits constructed from `sdk_trait_data` are marked as transient.
    """
    for sdk_trait_data_item in sdk_trait_data:
        sdk_trait_data_item["transient"] = True
    if identity := Identity.objects.filter(
        environment=environment,
        identifier=identifier,
    ).first():
        return identity, identity.update_traits(sdk_trait_data)
    return (
        identity := _get_transient_identity(
            environment=environment,
            identifier=identifier,
        )
    ), identity.generate_traits(sdk_trait_data, persist=False)


def get_persisted_identity_and_traits(
    environment: Environment,
    identifier: str,
    sdk_trait_data: list[SDKTraitData],
) -> IdentityAndTraits:
    """
    Retrieve a previously persisted `Identity` instance or persist a new one.
    Traits are persisted based on the `"transient"` attribute
    provided with each individual trait.
    """
    identity, created = Identity.objects.get_or_create(
        environment=environment,
        identifier=identifier,
    )
    persist_trait_data = environment.project.organisation.persist_trait_data
    if created:
        return identity, identity.generate_traits(
            sdk_trait_data,
            persist=persist_trait_data,
        )
    if persist_trait_data:
        return identity, identity.update_traits(sdk_trait_data)
    return identity, list(
        {
            trait.trait_key: trait
            for trait in chain(
                identity.identity_traits.all(),
                identity.generate_traits(sdk_trait_data, persist=False),
            )
        }.values()
    )


def _get_transient_identity(
    environment: Environment,
    identifier: str,
) -> Identity:
    return Identity(
        created_date=timezone.now(),
        environment=environment,
        identifier=identifier,
    )
