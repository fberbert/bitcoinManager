import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* HEADER */
  headerContainer: {
    height: 60,
    width: '100%',
    backgroundColor: '#181C14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  stackHeader: {
    backgroundColor: '#131010',
  },
  container: { flex: 1 },
  imageBG: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  displayArea: {
    backgroundColor: '#999911',
    opacity: 0.9,
    alignItems: 'center',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  displayText: {
    color: '#fff',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formArea: {
    padding: 10,
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 20,
    opacity: 0.65,
  },

  // Two-column row for form fields
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // Each column in the row
  col: {
    flex: 1,
    marginHorizontal: 5,
  },
  // Label style (used inside columns)
  colLabel: {
    color: '#fff',
    marginBottom: 5,
  },

  about: {
    title: {
      color: '#fff',
      fontSize: 22,
    },
    text: {
      color: '#fff',
      fontSize: 16,
      marginVertical: 10,
    },
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 5,
    color: '#fff',
    marginVertical: 5,
    paddingHorizontal: 10,
    maxHeight: 50,
    height: 50,
  },
  btnArea: {
    flexDirection: 'row',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnCalculate: {
    width: '45%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#355F2E',
  },
  btnAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#355F2E',
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
  },
  iconUp: { color: '#A8CD89', opacity: 1 },
  iconDown: { color: '#903749', opacity: 1 },
  iconFlat: { opacity: 0 },
  bigText: { fontSize: 50 },
  white: { color: '#fff' },

  // Botões de navegação no topo
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  headerButton: {
    padding: 10,
  },
  picker: {
    backgroundColor: '#222',
    color: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    maxHeight: 50,
    height: 50,
  },
});

export default styles;
