import { useUserState } from "@/state/user.state";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef } from "react";

const useStorage = () => {
  const idToken = useUserState((state) => state.idToken);
  const storageRef = useRef<FirebaseStorage>();

  useEffect(() => {
    const storage = getStorage();
    storageRef.current = storage;
  }, [idToken]);

  const uploadFile = async ({ file, path }: { file: File; path: string }) => {
    console.log(`Uploading file...`, file, path);
    if (storageRef.current) {
      try {
        const fileRef = ref(storageRef.current, path);
        const snapshot = await uploadBytes(fileRef, file);

        console.log(`snapshot`, snapshot);
        // Get the download URL
        const url = await getDownloadURL(fileRef);
        console.log(`Download URL`, url);
        return url;
      } catch (e) {
        console.log(e);
      }
    }
  };

  const uploadFileWithProgress = async ({
    file,
    path,
    onProgress,
    onComplete,
    onError,
  }: {
    file: File;
    path?: string;
    onProgress: (progress: number) => void;
    onComplete: (url: string) => void;
    onError?: (error: Error) => void;
  }) => {
    console.log(`Uploading file...`, file, path);
    if (storageRef.current) {
      try {
        const fileRef = ref(storageRef.current, path);

        // Create the file metadata
        var metadata = {
          contentType: file.type,
        };

        // Create upload task
        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            onProgress(progress);
          },
          (error) => {
            console.log("Upload failed", error);
            onError && onError(error);
          },
          async () => {
            // Upload completed successfully, now we can get the download URL
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", url);
            onComplete(url);
            return url;
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  return {
    storage: storageRef.current,
    uploadFile,
    uploadFileWithProgress,
  };
};
export default useStorage;
