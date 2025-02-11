'use client';

import React from 'react';
import {ReportModalProps} from "@/types/ProjectReport";

export default function ReportModal({report, onCloseAction}: ReportModalProps) {
  return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onCloseAction}
        ></div>
        <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={onCloseAction}
              title="Close"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{report.title}</h2>
          <p className="mb-2 text-black">
            <span className="font-semibold">Date:</span> {report.reportDate}
          </p>
          <p className="text-black">
            <span className="font-semibold">Content:</span> {report.content}
          </p>
        </div>
      </div>
  );
}
