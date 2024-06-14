import React, { useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

export default function Product() {
    const [listCategories, setListCategoreis] = useState([]);

    // useEffect(() => {
    //   const categet = async () => {
    //     const res = await cateGetAll();
    //     setListCategoreis(res.data);
    //   };
    //   categet();
    // }, []);
    const getCategoriesExport = async (event, done) => {
      const result = [];
      if (listCategories && listCategories.length > 0) {
        result.push([
          "categoriesId",
          "brandName",
          "ageRange",
          "subCategories",
          "packageType",
        ]);
        listCategories.map((cate, index) => {
          let arr = [];
          arr[0] = cate.categoriesId;
          arr[1] = cate.brandName;
          arr[2] = cate.ageRange;
          arr[3] = cate.subCategories;
          arr[4] = cate.packageType;
          result.push(arr);
        });
        setListCategoreis(result);
        done();
      }
    };
  
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
                <i className="fa-solid fa-file-import"></i> Import
              </label>
              <input type="file" hidden id="test" />
              {/* <Button variant="success">
              
              </Button> */}
            </div>
            <div className="sub-button">
              <CSVLink
                data={listCategories}
                filename={"Categories.csv"}
                className="btn btn-primary"
                asyncOnClick={true}
                // onClick={getCategoriesExport}
              >
                <i classNames="fa-solid fa-download"></i> Export
              </CSVLink>
            </div>
          </div>
        </div>
  
        <div className="search">
          <input
            id="search-cate"
            type="search"
            name="search-categoreis"
            placeholder="search"
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
  
        <div className="table-categories">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>stt</th>
                <th>categoriesId</th>
                <th>brandName</th>
                <th>ageRange</th>
                <th>subCategories</th>
                <th>packageType</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listCategories &&
                listCategories.map((cate, index) => {
                  return (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{cate.categoriesId}</td>
                      <td>{cate.brandName}</td>
                      <td>{cate.ageRange}</td>
                      <td>{cate.subCategories}</td>
                      <td>{cate.packageType}</td>
                      <th>
                        <Button variant="warning" className="action-button">
                          Update
                        </Button>
                        <Button variant="danger" className="action-button">
                          Delete
                        </Button>
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        </>
    )
}
