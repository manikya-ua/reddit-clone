import LoginCard from "./components/login-card";
import Modal from "./components/modal";
import ShowUser from "./components/show-user";
import SignupCard from "./components/sign-up-card";

export default async function Home() {
  return (
    <Modal>
      <div className="flex gap-5">
        <ShowUser />
        <SignupCard />
        <LoginCard />
      </div>
    </Modal>
  );
}
