import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const ReportManagement = () => {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        let isMounted = true; 
        axios.get('/api/reports').then((res) => { 
          if (isMounted) setReportData(res.data); 
        })
        return () => { isMounted = false };
      }, []);

// Delete the report but keep the thread
    const keepReportedThread = (reportID) => {
        axios.delete('/api/reports/' + reportID).then((res) => {
          console.log("report deleted");
          window.location.reload();
        });
    }
    
// Delete all related reports by threadID and then delete the thread
    const deleteReportedThread = (threadID) => {
      axios.delete('/api/reports/reportedThread/' + threadID).then((res) => {
        console.log("All related reports deleted");
        window.location.reload();
      });
      axios.delete('/api/threads/' + threadID).then((res) => {
        console.log("thread deleted");
      });
    }

    return (
      <div className="container">
        <h1 className="text-left">Reports</h1>
        {reportData.length == 0 ? <p>There are no report tickets at the moment :)</p> : (
        <ul>
          {reportData.map(report => (
            <li className='card' key={report._id}>
              <h3>Report ID: {report._id}</h3>
              <p>Reason: {report.desc}</p>
              <Popup trigger={<button className="btn btn-primary">Review</button>} modal>
                <div className="container">
                  <br />
                  <h1>{report.reportedThread.title}</h1>
                  <p>{report.reportedThread.desc}</p>
                  <h3 className="text-danger" style={{ marginTop: 100 }}>Report Reason</h3>
                  <p>{report.desc}</p>
                  <p>
                    <button className="btn btn-primary" style={{ marginLeft: 280}} onClick={() => { keepReportedThread(report._id) }}>Keep Thread</button>
                    <button className="btn btn-danger" onClick={() => { deleteReportedThread(report.reportedThread._id) }}>Delete Thread</button>
                  </p>
                </div>
              </Popup>
            </li>
          ))}
        </ul>
        )}
      </div>      
    )
}

export default ReportManagement;