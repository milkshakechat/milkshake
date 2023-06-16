import { useUserState } from "@/state/user.state";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
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

  return {
    storage: storageRef.current,
    uploadFile,
  };
};
export default useStorage;
