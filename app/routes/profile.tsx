import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Profile" }];
};

export default function Profile() {
  return <div>Profile</div>;
}
