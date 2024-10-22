import { Navbar } from "../_components/navbar";
const DashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="flex flex-col h-full">
      <div>
        <Navbar/>
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;