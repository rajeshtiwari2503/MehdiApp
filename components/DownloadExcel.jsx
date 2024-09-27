import XLSX from 'xlsx';
// import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

const ExportToExcel = async (data, fileName) => {
    try {
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        
        // Convert data to worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        
        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Complaints');
        
        // Write the workbook to a binary string
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to ArrayBuffer
        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; i++) {
            view[i] = wbout.charCodeAt(i) & 0xff;
        }
        const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Convert Blob to base64 string
        const base64 = await blobToBase64(blob);

        // Save the file locally
        // const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.xlsx`;
        await RNFS.writeFile("filePath", base64, 'base64');

        Alert.alert('File Saved', `Excel file has been saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving file:', error);
        Alert.alert('Error', 'Failed to save the file');
    }
};


const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.replace(/^data:.+;base64,/, ''));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export default ExportToExcel