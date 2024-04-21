
import { Metadata } from 'next';
import Hello from '@/components/ui/hello/hello';
 
export const metadata: Metadata = {
  title: 'Hello, World! | Sample App',
};

export default function Page() {

  return <Hello />;

}
