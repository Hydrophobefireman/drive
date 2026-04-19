import {clear} from "@hydrophobefireman/flask-jwt-jskit";
import {useEffect} from "@hydrophobefireman/ui-lib";
export default function Logout() {
  useEffect(() => {
    clear().then(() => (location.href = "/"));
  }, []);
  return <></>;
}
