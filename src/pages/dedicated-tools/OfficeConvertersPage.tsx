import React, { useState } from 'react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/layout/SeoHead';
import { UploadZone } from '../../components/tools/UploadZone';
import { ResultDownloadCard } from '../../components/tools/ResultDownloadCard';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useToast } from '../../components/common/Toast';
import { csvToExcel, excelToCsv, cleanSpreadsheetData } from '../../lib/office-engine';
import { downloadBytes, downloadBlob } from '../../lib/utils';
import { FileSpreadsheet } from 'lucide-react';
import { DocumentStorage } from '../../lib/storage';

interface OfficeConvertersPageProps {
  mode: 'csv-to-excel' | 'excel-to-csv' | 'excel-cleanup';
}

export const OfficeConvertersPage: React.FC<OfficeConvertersPageProps> = ({ mode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultData, setResultData] = useState<{
    bytes?: Uint8Array;
    csvText?: string;
    filename: string;
    duplicatesRemoved?: number;
  } | null>(null);

  const toast = useToast();

  const title =
    mode === 'csv-to-excel'
      ? 'CSV to Excel Converter'
      : mode === 'excel-to-csv'
      ? 'Excel to CSV Converter'
      : 'Excel & CSV Data Cleanup';

  const description =
    mode === 'csv-to-excel'
      ? 'Convert raw comma or semicolon delimited CSV files into styled Microsoft Excel (.xlsx) workbooks.'
      : mode === 'excel-to-csv'
      ? 'Export lightweight, UTF-8 encoded CSV files from complex multi-sheet Excel workbooks.'
      : 'Deduplicate rows, trim trailing whitespace, and normalize tabular data in one click.';

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(30);

    try {
      setProgress(70);

      if (mode === 'csv-to-excel') {
        const bytes = await csvToExcel(file);
        const outName = `${file.name.replace(/\.[^/.]+$/, '')}.xlsx`;
        setResultData({ bytes, filename: outName });
        DocumentStorage.saveDocument({ name: outName, size: bytes.byteLength, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', data: bytes });
        toast.success('Converted to Excel successfully!');
      } else if (mode === 'excel-to-csv') {
        const csv = await excelToCsv(file);
        const outName = `${file.name.replace(/\.[^/.]+$/, '')}.csv`;
        setResultData({ csvText: csv, filename: outName });
        DocumentStorage.saveDocument({ name: outName, size: csv.length, type: 'text/csv', data: csv });
        toast.success('Converted to CSV successfully!');
      } else {
        const cleanRes = await cleanSpreadsheetData(file);
        const outName = `Cleaned_${file.name}`;
        setResultData({
          bytes: cleanRes.data,
          filename: outName,
          duplicatesRemoved: cleanRes.duplicatesRemoved,
        });
        DocumentStorage.saveDocument({ name: outName, size: cleanRes.data.byteLength, type: file.type, data: cleanRes.data });
        toast.success(`Cleaned data! Removed ${cleanRes.duplicatesRemoved} duplicate row(s).`);
      }
      setProgress(100);
    } catch (err: any) {
      toast.error(err.message || 'Failed to process spreadsheet file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultData) return;
    if (resultData.bytes) {
      downloadBytes(
        resultData.bytes,
        resultData.filename,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    } else if (resultData.csvText) {
      const blob = new Blob([resultData.csvText], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, resultData.filename);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead title={`${title} — Doclly`} description={description} />
      <Breadcrumb items={[{ label: 'Tools', to: '/' }, { label: title }]} />

      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{title}</h1>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        {resultData ? (
          <ResultDownloadCard
            filename={resultData.filename}
            title="Spreadsheet Processed!"
            description={
              resultData.duplicatesRemoved !== undefined
                ? `Cleaned rows and removed ${resultData.duplicatesRemoved} duplicates.`
                : 'Conversion completed successfully.'
            }
            onDownload={handleDownload}
            onStartOver={() => {
              setFile(null);
              setResultData(null);
              setProgress(0);
            }}
          />
        ) : (
          <>
            {!file ? (
              <UploadZone
                onFilesSelected={(files) => files[0] && setFile(files[0])}
                accepts={['.csv', '.xlsx', '.xls', 'text/csv']}
                acceptsDescription={mode === 'csv-to-excel' ? 'CSV files' : 'Excel or CSV workbooks'}
                maxFiles={1}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{file.name}</h3>
                    <p className="text-xs text-[#6B7280]">
                      Ready to execute {mode.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-[#111111] font-bold hover:underline"
                  >
                    Change file
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    onClick={handleConvert}
                    leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                  >
                    Process File
                  </Button>
                </div>

                {isProcessing && (
                  <div className="pt-2">
                    <ProgressBar progress={progress} label="Transforming spreadsheet data..." />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
