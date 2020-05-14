import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from '@reach/router';
import config from "../../assets/config";
import ResourceTemplate from "../../components/Resource";

import {
  Text,
  Organization,
  Table,
  Tags,
  TopicIcon,
  TopicWrapper
} from "@civicactions/data-catalog-components";
import orgs from "../../assets/publishers";

const Dataset = ({id, path}) => {
  // const item = props.pageContext.dataset;
  // const path = props.path;
  const [item, setItem] = useState({})
  const [hasWindow, checkForWindow] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      checkForWindow(true);
    }

    async function getItem() {
      const { data } = await axios.get(`http://dkan/api/1/metastore/schemas/dataset/items/${id}?show-reference-ids`);
      setItem(data);
    }
    getItem();
  }, [id]);

  const orgName =
    "publisher" in item && item.publisher ? item.publisher.data.name : "";
  const orgDetails = orgs.filter(org => orgName === org.name);
  const orgImage = orgDetails.length && orgDetails[0].imageUrl ? orgDetails[0].imageUrl : "";
  const orgDesc = orgDetails.length && orgDetails[0].description ? orgDetails[0].description : "";

  const tag = "keyword" in item ? item.keyword : [];
  const theme = "theme" in item ? item.theme : [];
  //const columns = "columns" in item ? item.columns : [];

  function themes(theme) {
    if (!theme) {
      return null;
    } else {
      return theme.map(topic => {
        return (
          <TopicWrapper component={TopicIcon} topic={topic.data} key={topic.identifier}/>
        );
      });
    }
  }

  // // Process content for 'Columns in this Dataset' table.
  // // const labelsT2 = {};
  // // const valuesT2 = {};

  // // columns.forEach((value, index) => {
  // //   labelsT2[index] = { label: value };
  // //   valuesT2[index] = "String";
  // // });

  // // Process content for 'Additional Information' table.
  const labelsT3 = {};
  const valuesT3 = {};

  if (orgName && orgName.length > 0) {
    labelsT3.publisher = { label: "Publisher" };
    valuesT3.publisher = orgName;
  }
  if ("identifier" in item && item.identifier) {
    labelsT3.identifier = { label: "Identifier" };
    valuesT3.identifier = item.identifier;
  }
  if ("issued" in item && item.issued) {
    labelsT3.issued = { label: "Issued" };
    valuesT3.issued = item.issued;
  }
  if ("modified" in item && item.modified) {
    labelsT3.modified = { label: "Last Update" };
    valuesT3.modified = item.modified;
  }
  if ("contactPoint" in item && item.contactPoint && item.contactPoint.fn) {
    labelsT3.contact = { label: "Contact" };
    valuesT3.contact = item.contactPoint.fn;
  }
  if (
    "contactPoint" in item &&
    item.contactPoint &&
    item.contactPoint.hasEmail
  ) {
    labelsT3.email = { label: "Contact E-mail" };
    valuesT3.email = `<a href="${item.contactPoint.hasEmail}">${item.contactPoint.hasEmail}</a>`;
  }
  if ("accessLevel" in item && item.accessLevel) {
    labelsT3.access = { label: "Public Access Level" };
    valuesT3.access = item.accessLevel;
  }
  if ("landingPage" in item && item.landingPage) {
    labelsT3.homepage = { label: "Homepage URL" };
    valuesT3.homepage = `<a href="${item.landingPage}">${item.landingPage}</a>`;
  }

  return (
    <div className={`dc-dataset-page ${config.container}`}>
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <Organization
              name={orgName}
              imageUrl={orgImage}
              description={orgDesc}
            />
            <div className="dc-block-wrapper">
              The information on this page is also available via the{" "}
              <Link to={`dataset/${item.identifier}/api`}>API</Link>.
            </div>
          </div>
          <div className="col-md-9 col-sm-12">
            <h1>{item.title}</h1>
            {theme.length && <div className="dc-item-theme">{themes(theme)}</div>}
            <Text value={item.description} />
            {(hasWindow && item.distribution) &&
              item.distribution.map(dist => {
                return <ResourceTemplate key={dist.identifier} resource={dist} identifier={dist.identifier} />;
              })}
            <Tags tags={tag} path="/search?keyword=" label="Tags" />
            {/* <Table
              configuration={labelsT2}
              data={valuesT2}
              title="Columns in this Dataset"
              th1="Column Name"
              th2="Type"
              tableclass="table-two"
            /> */}
            <Table
              configuration={labelsT3}
              data={valuesT3}
              tableclass="table-three"
            />
          </div>
        </div>
      </div>
  );
};

export default Dataset;