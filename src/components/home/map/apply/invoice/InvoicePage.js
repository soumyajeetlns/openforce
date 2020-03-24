import React from 'react';
import Page from './Page';
import * as css from './Invoice.css';
import logo from '../../../../../assets/img/logo_invoice.jpg';

const InvoicePage = ({id, job, employee}) => (<Page singleMode={true} id={id}>
  <header className="clearfix">
  <div className="logo">
    <img src={logo} />
  </div>
  <div className="company clearfix">
    <div>Invoice Number: {employee.uid}</div>
    <div>Invoice Date: NA</div>        
  </div>
  <div className="project">
    <div>Worker: {employee.user.firstName} {employee.user.lastName}</div>
    <div>Client: {job.employerName}</div>
    <div>Job title: {job.jobRole.name}</div>        
  </div>
  <br clear="all" />
  <div className="client-details">
    <div>Client name: {job.employerName}</div>
    <div>Client address: {job.address}</div>
  </div>
</header>
<main>
  <table>
    <thead>
      <tr>
        <th className="service">Job no</th>
        <th className="desc">Job description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="service">{employee.jobId}</td>
        <td className="desc">{job.description}</td>
        <td className="total">£{employee.payRate}</td>
      </tr>
   <tr>
        <th className="service">&nbsp;</th>
        <th className="desc">Total</th>
        <th><span className="total">£{employee.payRate}</span></th>
      </tr>
             </tbody>
  </table>
  <div className="notices">
    <div className="notice">*Generated through Openforce</div>
  </div>
</main>
</Page>);

export default InvoicePage;