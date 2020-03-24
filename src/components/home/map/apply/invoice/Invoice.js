import React from "react";
import InvoicePage from "./InvoicePage";
import InvoiceButton from "./InvoiceButton";


const Invoice = ({id, job, employee}) => (<div className="bg-black-80 w-100 pv5">
  <InvoiceButton id={"InvoicePage"} invoice={employee} label={"Download Invoice"} />
  <InvoicePage job={job} employee={employee} id={"InvoicePage"}/>
</div>);

export default Invoice;