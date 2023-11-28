import { gql } from '@apollo/client';

export const CENSOR_MEDIA = gql`
  mutation CensorMedia($input: MediaInput!) {
    mediaCensor(input: $input) {
      clientMutationId
      status
    }
  }
`;

export const VALIDATE_MEDIA = gql`
  mutation ValidateMedia($input: MediaInput!) {
    mediaValid(input: $input) {
      clientMutationId
      status
    }
  }
`;
