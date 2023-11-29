import { GraphQLError } from "graphql";
import fs from "fs";
import path from "path";
import https from "https";

const loadSchema = (dir) => {
  return fs
    .readdirSync(dir)
    .map((fn) => fs.readFileSync(path.join(dir, fn)).toString())
    .join("\n");
};

const getMedias = () => {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://api.dailymotion.com/videos?owners=dailymotion&limit=100&fields=id%2Cthumbnail_url%2Cdescription%2Cembed_url%2Curl%2Cchannel.name%2Cowner.id%2Cowner.description%2Cowner.nickname",
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try {
              const resp = JSON.parse(body);
              if ("error" in resp) {
                reject(resp["error"]["message"]);
              }
              resolve(resp["list"]);
            } catch (error) {
              reject(error);
            }
          });
        }
      )
      .on("error", reject);
  });
};

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const chaosMonkey = async () => {
  await delay(Math.random() * 300) // simulate server delay
  if (Math.random() > 0.9) {
    // simulate internal network issue
    throw new GraphQLError(`internal server error`);
  }
}

const mediaMutation = (type) => {
  return async (_, { input: { clientMutationId, id, reason } }) => {
    await chaosMonkey()
    console.log(`media ${id} has been ${type}ed with reason ${reason}`);
    return {
      clientMutationId,
      status: "SUCCESS",
    };
  }
}

const queryNextTask = async () => {
  await chaosMonkey()
  const items = await getMedias()
  return {
    media: items[Math.floor(Math.random() * items.length)],
  };
}

export default {
  typeDefs: loadSchema("./schema"),
  resolvers: {
    Query: {
      moderation: () => ({
        nextTask: {},
      }),
    },
    Mutation: {
      mediaCensor: mediaMutation('censor'),
      mediaValid: mediaMutation('valid'),
    },
    Moderation: {
      nextTask: queryNextTask,
    },
    Media: {
      id: (d) => d["id"],
      thumbnailURL: (d) => d["thumbnail_url"],
      category: (d) => d["channel.name"],
      channel: (d) => d,
      description: (d) => d["description"],
      embedURL: (d) => d["embed_url"],
      url: (d) => d["url"],
    },
    Channel: {
      id: (d) => d["owner.id"],
      description: (d) => d["owner.description"],
      name: (d) => d["owner.nickname"],
    },
  },
};
