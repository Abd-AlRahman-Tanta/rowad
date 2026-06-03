const useChunk = (array: Array<any>, groupNumber: number): Array<any> => {
  const chunk = [];
  for (let i = 0; i < array.length; i += groupNumber) {
    chunk.push(array.slice(i, i + groupNumber));
  }
  return chunk
}
export default useChunk
