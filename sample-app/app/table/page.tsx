import { Metadata } from 'next';
import Table from '@/components/ui/table/table';
 
export const metadata: Metadata = {
  title: 'Table | Sample App',
};

export default function Page() {

  return <Table />;

}