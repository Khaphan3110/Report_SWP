import React from "react";
import "./Categories.css";
import { Button, Table } from "react-bootstrap";
export default function Categories() {
  return (
    <>
      <div className="header-categories">
        <div className="search-form">
          {/* <input type="search" name="searchCategories" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i> */}
          <h4>List categories</h4>
        </div>

        <div className="button-categories">
          <div className="sub-button">
            <label htmlFor="test" className="btn btn-success">
            <i class="fa-solid fa-file-import"></i> Import
            </label>
            <input type="file" hidden id="test"/>
            {/* <Button variant="success">
            
            </Button> */}
          </div>
          <div className="sub-button">
            <Button variant="secondary">
              <i className="fa-solid fa-plus"></i> Export
            </Button>
          </div>
        </div>
      </div>

      <div className="search">
        <label htmlFor="search-cate"></label>
        <input
          id="search-cate"
          type="search"
          name="search-categoreis"
          placeholder="search "
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="table-categories">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>CateID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
