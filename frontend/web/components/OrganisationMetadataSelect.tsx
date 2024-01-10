import { FC, useEffect, useState } from 'react'
import { useGetListMetadataQuery } from 'common/services/useMetadata'
import { useGetMetadataModelFieldListQuery } from 'common/services/useMetadataModelField'

import MetadataSelect, { MetadataSelectType } from './MetadataSelect' // we need this to make JSX compile

type OrganisationMetadataSelectType = MetadataSelectType & {
  orgId: string
  contentType: number
}

const OrganisationMetadataSelect: FC<OrganisationMetadataSelectType> = ({
  contentType,
  orgId,
  ...props
}) => {
  const [metadataList, setMetadataList] = useState()
  const { data: metadata } = useGetListMetadataQuery({ organisation: orgId })
  const { data: metadataModelField } = useGetMetadataModelFieldListQuery({
    organisation_id: orgId,
  })

  useEffect(() => {
    if (metadata?.results?.length && metadataModelField?.results?.length) {
      const metadataForContentType = metadata.results.filter((meta) => {
        return metadataModelField.results.some(
          (item) => item.field === meta.id && item.content_type === contentType,
        )
      })
      setMetadataList(metadataForContentType)
    }
  }, [metadata, metadataModelField])

  return <MetadataSelect {...props} metadata={metadataList} />
}

export default OrganisationMetadataSelect
