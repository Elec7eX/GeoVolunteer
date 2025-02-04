import { useEffect } from "react";
import userService from "../services/UserServices";
import { Breadcrumb, BreadcrumbItem, Button } from "react-bootstrap";

export default function User() {
  useEffect(() => {
    const fetchBenutzers = async () => {
      try {
        const data = await userService.getAll();
        console.log(data);
      } catch (err) {
        console.log("err");
      }
    };

    fetchBenutzers();
  }, []);
  return (
    <>
      <div>
        <h1>User</h1>
        
        <Button>Button - Test</Button>
        <Breadcrumb>
          <BreadcrumbItem>Item 1</BreadcrumbItem>
          <BreadcrumbItem>Item 2</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </>
  );
}
