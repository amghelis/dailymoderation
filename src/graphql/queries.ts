import { gql } from '@apollo/client';

export const GET_NEXT_TASK = gql`
  query GetNextTask {
    moderation {
      nextTask {
        media {
          category
          description
          embedURL
          id
          thumbnailURL
          url
          channel {
            description
            id
            name
          }
        }
      }
    }
  }
`;
