import CredentialsLogin from "@/components/CredentialsLogin";
import PasswordlessLogin from "@/components/PasswordlessLogin";

const Login = () => {
  console.log("Login Page");
  return (
    <div className="selection:bg-indigo-500 selection:text-white">
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex m-2 p-2 shadow-xl rounded-md">
          <div className="w-1/2 pr-2 border-r border-gray-500">
            <CredentialsLogin />
          </div>
          <div className="w-1/2 pl-2">
            <PasswordlessLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
