import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNewLottery } from '../hooks/useNewLottery';
import { colors } from '../colors';

const lotterySchema = Yup.object({
  name: Yup.string().min(4).required(),
  prize: Yup.string().min(4).required(),
});

type Props = {
  onSubmit: () => void;
  onNavigateBack: () => void;
};

const LotteryForm = ({ onSubmit, onNavigateBack }: Props) => {
  const { error, loading, createNewLottery } = useNewLottery();

  const handleClose = () => {
    formik.resetForm();
    onNavigateBack();
  };

  const formik = useFormik({
    validationSchema: lotterySchema,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      name: '',
      prize: '',
    },
    onSubmit: async (values) => {
      await createNewLottery({ name: values.name, prize: values.prize });
      onSubmit();
      handleClose();
    },
  });

  const nameError = formik.errors.name && formik.touched.name;
  const prizeError = formik.errors.prize && formik.touched.prize;

  const backgroundColor = !formik.isValid
    ? colors.grey
    : colors.buttonSecondary;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new lottery</Text>
      <TextInput
        accessibilityLabel="Lottery Input Field"
        style={styles.input}
        placeholder="Lottery Name"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
      />
      {nameError && <Text style={styles.error}>{formik.errors.name}</Text>}
      <TextInput
        accessibilityLabel="Lottery Prize Input"
        style={styles.input}
        placeholder="Lottery Prize"
        value={formik.values.prize}
        onChangeText={formik.handleChange('prize')}
        onBlur={formik.handleBlur('prize')}
      />
      {prizeError && <Text style={styles.error}>{formik.errors.prize}</Text>}
      <Pressable
        accessibilityRole="button"
        style={[styles.button, { backgroundColor }]}
        onPress={() => formik.handleSubmit()}
        disabled={!formik.isValid}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>ADD</Text>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>error</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    fontSize: 16,
  },
  error: {
    fontSize: 10,
    color: colors.danger,
    paddingTop: 8,
  },
  button: {
    marginTop: 32,
    width: 64,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LotteryForm;
