import config from "@/config.env";
import { getVideoFileExtension } from "@milkshakechat/helpers";

/**
 * const input = "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/users%2FbpSkq4bQFuWYoj7xtGD8pr5gUdD3%2Fstory%2Fvideo%2F258f75b5-9bb0-431e-9da8-b40df2c418b8.mp4?alt=media&token=2dce18f4-aaff-4891-8569-f23b837370c1";
 *
 * console.log(translate3(input));
 * should return:
 * "https://storage.googleapis.com/user-stories-social/users/bpSkq4bQFuWYoj7xtGD8pr5gUdD3/story/video/258f75b5-9bb0-431e-9da8-b40df2c418b8/video-streaming/manifest.m3u8"
 */
export const predictVideoTranscodedManifestRoute = (url: string) => {
  // Extract the path from the URL
  let path = new URL(url).pathname;

  // URL decode the path
  let decodedPath = decodeURIComponent(path);

  // Find the position of "/users" in the path
  let usersPos = decodedPath.indexOf("/users");

  // Extract the relevant part of the path
  let relevantPath = decodedPath.slice(usersPos);

  const extensionType = getVideoFileExtension(url);

  // Remove the .mp4 from the relevant path and add the video streaming path
  let newPath = relevantPath.replace(`.${extensionType}`, "");

  // Create the new URL
  let translatedUrl = `https://storage.googleapis.com/${config.VIDEO_TRANSCODER.bucket.name}${newPath}/video-streaming/manifest.m3u8`;

  return translatedUrl;
};
