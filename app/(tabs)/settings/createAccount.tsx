import AuthForm from "@/components/account/AuthForm";
import React from "react";

const CreateAccount = () => {
  return <AuthForm type="create" />;
};

export default React.memo(CreateAccount);
