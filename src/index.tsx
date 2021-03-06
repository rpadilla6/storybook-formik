import React from 'react';
import { Formik, Form } from 'formik';
import addons, { makeDecorator } from '@storybook/addons';
import {
  ConfigWithoutSubmit,
  EVT_ON_SUBMIT,
  EVT_RENDER,
  EVT_SUBMIT,
} from './shared';

export const withFormik = makeDecorator({
  name: 'withFormik',
  parameterName: 'formik',
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const channel = addons.getChannel();
    let submitter: () => void;
    channel.on(EVT_SUBMIT, () => submitter && submitter());
    const formikConfig = parameters as ConfigWithoutSubmit | undefined;
    const initialValues = (formikConfig && formikConfig.initialValues) || {};

    return (
      <Formik
        onSubmit={(v, { setSubmitting }) => {
          channel.emit(EVT_ON_SUBMIT, v);
          setSubmitting(false);
        }}
        {...formikConfig}
        initialValues={initialValues}
      >
        {props => {
          channel.emit(EVT_RENDER, props
          );
          if (!submitter) {
            submitter = props.submitForm;
          }
          return <Form>{getStory(context)}</Form>;
        }}
      </Formik>
    );
  },
});

export default withFormik;
