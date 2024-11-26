/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getTicket } from "./graphql/queries";
import { updateTicket } from "./graphql/mutations";
const client = generateClient();
export default function TicketUpdateForm(props) {
  const {
    id: idProp,
    ticket: ticketModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    userId: "",
    title: "",
    content: "",
    status: "",
    resolverId: "",
  };
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [title, setTitle] = React.useState(initialValues.title);
  const [content, setContent] = React.useState(initialValues.content);
  const [status, setStatus] = React.useState(initialValues.status);
  const [resolverId, setResolverId] = React.useState(initialValues.resolverId);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = ticketRecord
      ? { ...initialValues, ...ticketRecord }
      : initialValues;
    setUserId(cleanValues.userId);
    setTitle(cleanValues.title);
    setContent(cleanValues.content);
    setStatus(cleanValues.status);
    setResolverId(cleanValues.resolverId);
    setErrors({});
  };
  const [ticketRecord, setTicketRecord] = React.useState(ticketModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getTicket.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getTicket
        : ticketModelProp;
      setTicketRecord(record);
    };
    queryData();
  }, [idProp, ticketModelProp]);
  React.useEffect(resetStateValues, [ticketRecord]);
  const validations = {
    userId: [],
    title: [],
    content: [],
    status: [],
    resolverId: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          userId: userId ?? null,
          title: title ?? null,
          content: content ?? null,
          status: status ?? null,
          resolverId: resolverId ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateTicket.replaceAll("__typename", ""),
            variables: {
              input: {
                id: ticketRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TicketUpdateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={userId}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId: value,
              title,
              content,
              status,
              resolverId,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              title: value,
              content,
              status,
              resolverId,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Content"
        isRequired={false}
        isReadOnly={false}
        value={content}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              title,
              content: value,
              status,
              resolverId,
            };
            const result = onChange(modelFields);
            value = result?.content ?? value;
          }
          if (errors.content?.hasError) {
            runValidationTasks("content", value);
          }
          setContent(value);
        }}
        onBlur={() => runValidationTasks("content", content)}
        errorMessage={errors.content?.errorMessage}
        hasError={errors.content?.hasError}
        {...getOverrideProps(overrides, "content")}
      ></TextField>
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              title,
              content,
              status: value,
              resolverId,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      >
        <option
          children="New"
          value="NEW"
          {...getOverrideProps(overrides, "statusoption0")}
        ></option>
        <option
          children="In progress"
          value="IN_PROGRESS"
          {...getOverrideProps(overrides, "statusoption1")}
        ></option>
        <option
          children="Resolved"
          value="RESOLVED"
          {...getOverrideProps(overrides, "statusoption2")}
        ></option>
        <option
          children="Closed"
          value="CLOSED"
          {...getOverrideProps(overrides, "statusoption3")}
        ></option>
      </SelectField>
      <TextField
        label="Resolver id"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={resolverId}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              userId,
              title,
              content,
              status,
              resolverId: value,
            };
            const result = onChange(modelFields);
            value = result?.resolverId ?? value;
          }
          if (errors.resolverId?.hasError) {
            runValidationTasks("resolverId", value);
          }
          setResolverId(value);
        }}
        onBlur={() => runValidationTasks("resolverId", resolverId)}
        errorMessage={errors.resolverId?.errorMessage}
        hasError={errors.resolverId?.hasError}
        {...getOverrideProps(overrides, "resolverId")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || ticketModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || ticketModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
