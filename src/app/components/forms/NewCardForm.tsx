import {
  FormControl,
  VStack,
  HStack,
  Input,
  FormErrorMessage,
  Button
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldProps } from "formik";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/redux/hooks";
import { createCard } from "@/app/lib/redux/features/projects/projectsSlice";
import { Icon } from "@iconify/react/dist/iconify.js";

interface NewCardFormProps {
  tableIndex: number;
  setShowForm: (bool: boolean) => void;
}

const NewCardForm = ({
  tableIndex,
  setShowForm
}: NewCardFormProps): JSX.Element => {
  // Redux
  const tables: TableSlice[] = useAppSelector((state) => state.project.tables);
  const dispatch = useAppDispatch();

  // Form field valid status.
  const [validCardName, setValidCardName] = useState<boolean>(false);

  // * Form Validation * //

  const validateCardName = (
    inputCardName: string | undefined
  ): string | undefined => {
    let cardNameError;

    if (!inputCardName) {
      cardNameError = "A name is required.";
      setValidCardName(false);
    } else if (/[^a-zA-Z\d\s:]/.test(inputCardName)) {
      cardNameError = "Only words, numbers, and spaces are allowed.";
      setValidCardName(false);
    } else {
      setValidCardName(true);
    }

    return cardNameError;
  };

  // Entire form valid
  const [validForm, setValidForm] = useState<boolean>(false);

  // Validate the fields when any of them change.
  useEffect(() => {
    if (!validCardName) {
      setValidForm(false);
    }

    if (validCardName) {
      setValidForm(true);
    }
  }, [validCardName]);

  // * Handle Creating Table * //

  interface FormFields {
    cardName: string;
  }

  const handleSubmit = async ({ cardName }: FormFields): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      const newCardInfo = {
        tableIndex,
        newCardTitle: cardName
      };
      dispatch(createCard(newCardInfo));

      if (tables[tables.length - 1].title === cardName) {
        resolve(true);

        setShowForm(false);
      }

      return reject(false);
    });
  };

  // Field theme
  const fieldTheme = {
    bg: "gray.900",
    borderColor: "white",
    _placeholder: {
      color: "gray.400",
      fontWeight: "light"
    },
    _focus: {
      bg: "#000",
      color: "#FFF",
      borderColor: "#63b3ed",
      boxShadow: "0 0 0 1px #63b3ed",
      zIndex: "1"
    }
  };

  return (
    <Formik
      initialValues={{
        cardName: ""
      }}
      onSubmit={(data, actions) => {
        handleSubmit(data)
          .then((status) => {
            actions.setSubmitting(false);
            if (status) {
              actions.resetForm({
                values: {
                  cardName: ""
                }
              });
            }
          })
          .catch(() => {
            actions.setSubmitting(false);
          });
      }}
    >
      {(props) => (
        <Form
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <HStack
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
            w="100%"
            h="auto"
          >
            <Field name="cardName" validate={validateCardName}>
              {({ field, form }: FieldProps) => (
                <FormControl
                  isInvalid={
                    form.errors.cardName && form.touched.cardName ? true : false
                  }
                >
                  <VStack
                    h="auto"
                    w="100%"
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <HStack
                      h="auto"
                      w="100%"
                      spacing={0}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Input
                        ml={2}
                        required
                        {...fieldTheme}
                        type="text"
                        isDisabled={form.isSubmitting}
                        {...field}
                        id="cardName"
                        placeholder="Completed Tasks"
                        {...(!form.errors.cardName && form.touched.cardName
                          ? {
                              borderColor: "brand.valid",
                              boxShadow: "0 0 0 1px #00c17c",
                              _hover: {
                                borderColor: "brand.valid",
                                boxShadow: "0 0 0 1px #00c17c"
                              }
                            }
                          : "")}
                        onMouseLeave={() => {
                          form.validateField("cardName");
                          form.setFieldTouched("cardName'");
                        }}
                      />
                    </HStack>
                    <FormErrorMessage>
                      {typeof form.errors.cardName === "string"
                        ? form.errors.cardName
                        : ""}
                    </FormErrorMessage>
                  </VStack>
                </FormControl>
              )}
            </Field>
            <Button
              variant="submit"
              isDisabled={!validForm}
              background={validForm ? "brand.valid" : "brand.danger"}
              isLoading={props.isSubmitting}
              type="submit"
              p={0}
              bg=""
            >
              {validForm ? (
                <Icon fontSize="3rem" icon="solar:check-circle-bold" />
              ) : (
                <Icon fontSize="3rem" icon="solar:close-circle-bold-duotone" />
              )}
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
};

export default NewCardForm;