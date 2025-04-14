import AccountHeader from "@/app/components/AccountHeader";

const AccountLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <AccountHeader />
      {children}
    </>
  );
};

export default AccountLayout;
