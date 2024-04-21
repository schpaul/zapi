import { Metadata } from 'next';
import Login from '@/components/ui/login/login';
 
export const metadata: Metadata = {
  title: 'Login | Sample App',
};

export default function Page() {

  return <Login />;

}