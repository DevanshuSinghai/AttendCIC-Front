// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthProvider';
// import { useRouter } from 'expo-router';
// import Constants from 'expo-constants';

// // Optional: Chart components
// import { BarChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// export default function GetAttendanceScreen() {
  
//   const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
//   const [endDate, setEndDate] = useState<Date>(new Date());
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);


//   const { user, token } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [papers, setPapers] = useState<{ paperId: number; name: string }[]>([]);
//   const [selectedPaper, setSelectedPaper] = useState<number | null>(null);
//   const [attendanceData, setAttendanceData] = useState<{
//   last5Days: { date: string; present: number; absent: number }[];
//   overallPercentage: number;
//   detailedRecords: { /* ... */ }[];
//   rollCallSummaries: {
//     rollCallId: number;
//     date: string;
//     time: string;
//     presentCount: number;
//     totalStudents: number;
//     }[];
//   } | null>(null);
    
//   const [selectedRollCall, setSelectedRollCall] = useState<{
//   rollCallId: number;
//   students: typeof attendanceData.detailedRecords;
//   } | null>(null);
//   const API_URL = Constants.expoConfig?.extra?.API_URL;

//   useEffect(() => {
//     fetchPapers();
//   }, []);

//   const statusBadgeStyles = {
//     present: styles.present,
//     absent: styles.absent,
//     late: styles.late,
//   };

//   const getStudentsForRollCall = (rollCallId: number) => {
//     // Reconstruct using submissions → you can also enhance backend to send map
//     // For now, simulate: in real app, backend should send this mapping
//     // But as a quick fix, we'll assume all detailedRecords belong to shown roll calls
//     // (Better: update backend to send roll_call_id in detailedRecords)

//     // 🔜 TEMPORARY: Since your current detailedRecords don't include roll_call_id,
//     // we can't reliably filter. So we'll enhance detailedRecords in backend next.
//     return attendanceData?.detailedRecords || [];
//   };

//   const fetchPapers = async () => {
//     try {
//       console.log("fetching papers")
//       const response = await axios.get(`${API_URL}/teacher/papers`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log(response.data)
//       setPapers(response.data.papers || []);
//       if (response.data.papers.length > 0) {
//         setSelectedPaper(response.data.papers[0].paperId);
//       } else {
//         setLoading(false);
//       }
//     } catch (err: any) {
//       console.error('Fetch papers error:', err);
//       Alert.alert('Error', 'Failed to load papers');
//       setLoading(false);
//     }
//   };

//   const fetchAttendance = async () => {
//     if (!selectedPaper) return;
    
//     // Format dates to YYYY-MM-DD for API query
//     const start = startDate.toISOString().split('T')[0];
//     const end = endDate.toISOString().split('T')[0];

//     setLoading(true);
//     try {
//       const response = await axios.get(
//         // 💡 NEW: Include date range in the API call
//         `${API_URL}/teacher/get-attendance?paperId=${selectedPaper}&startDate=${start}&endDate=${end}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setAttendanceData(response.data);
//     } catch (err: any) {
//       // ... error handling ...
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedPaper != null) {
//       fetchAttendance();
//     } else {
//       setLoading(false);
//     }
//   }, [selectedPaper]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (!attendanceData) {
//     return (
//       <View style={styles.container}>
//         <Text>No data available</Text>
//       </View>
//     );
//   }

//   // Prepare chart data
//   const chartData = {
//       // 💡 FIX: Use the date label directly from the backend data, 
//       //         as it has already been formatted correctly.
//       labels: attendanceData.last5Days.map(d => d.date),
//       datasets: [
//           {
//               data: attendanceData.last5Days.map(d => d.present),
//               color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
//               strokeWidth: 2,
//               label: 'Present',
//           },
//           {
//               data: attendanceData.last5Days.map(d => d.absent),
//               color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`,
//               strokeWidth: 2,
//               label: 'Absent',
//           },
//       ],
//       legend: ['Present', 'Absent'],
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>View Attendance</Text>

//       {/* Select Paper */}
//       <Text style={styles.label}>Select Paper</Text>
//       <Picker
//         selectedValue={selectedPaper}
//         onValueChange={(value) => setSelectedPaper(value)}
//         style={styles.picker}
//       >
//         {papers.map(paper => (
//           <Picker.Item key={paper.paperId} label={paper.name} value={paper.paperId} />
//         ))}
//       </Picker>

//         <Text style={styles.label}>Select Date Range</Text>
//       <View style={styles.datePickerRow}>
//           <View style={styles.datePickerContainer}>
//               <Text style={styles.dateLabel}>Start Date</Text>
//               <TouchableOpacity 
//                   style={styles.dateButton} 
//                   onPress={() => setShowStartDatePicker(true)}
//               >
//                   <Text>{startDate.toLocaleDateString()}</Text>
//               </TouchableOpacity>
//               {showStartDatePicker && (
//                   <DateTimePicker
//                       value={startDate}
//                       mode="date"
//                       display="default"
//                       onChange={(event, selectedDate) => {
//                           setShowStartDatePicker(false);
//                           if (selectedDate) {
//                               setStartDate(selectedDate);
//                           }
//                       }}
//                       maximumDate={endDate} // Constraint: Start date cannot be after end date
//                   />
//               )}
//           </View>
//           <View style={styles.datePickerContainer}>
//               <Text style={styles.dateLabel}>End Date</Text>
//               <TouchableOpacity 
//                   style={styles.dateButton} 
//                   onPress={() => setShowEndDatePicker(true)}
//               >
//                   <Text>{endDate.toLocaleDateString()}</Text>
//               </TouchableOpacity>
//               {showEndDatePicker && (
//                   <DateTimePicker
//                       value={endDate}
//                       mode="date"
//                       display="default"
//                       onChange={(event, selectedDate) => {
//                           setShowEndDatePicker(false);
//                           if (selectedDate) {
//                               setEndDate(selectedDate);
//                           }
//                       }}
//                       minimumDate={startDate} // Constraint: End date cannot be before start date
//                       maximumDate={new Date()}
//                   />
//               )}
//           </View>
//       </View>

//         <TouchableOpacity style={styles.fetchButton} onPress={fetchAttendance} disabled={loading}>
//             <Text style={styles.fetchButtonText}>Get Attendance</Text>
//         </TouchableOpacity>
//       {/* Last 5 Days Chart */}
//       <Text style={styles.sectionTitle}>Last 5 Days Attendance</Text>
//       <View style={styles.chartContainer}>
//         <BarChart
//           data={chartData}
//           width={screenWidth - 40}
//           height={220}
//           yAxisLabel=""
//           yAxisSuffix=""
//           showValuesOnTopOfBars={true} // 💡 NEW: Show numbers on bars for clarity
//           fromZero={true}
//           chartConfig={{
//             backgroundColor: '#fff',
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             decimalPlaces: 0,
//             barPercentage: 0.5,
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: { borderRadius: 16 },
//             propsForDots: { r: '6' },
//             propsForLabels: {fontSize: 10}
//           }}
//           style={{ marginVertical: 8, borderRadius: 16 }}
//         />
//       </View>
//       <Text style={styles.legend}>
//         Overall attendance over the last 5 days: <Text style={styles.bold}>{attendanceData.overallPercentage.toFixed(1)}%</Text> present.
//       </Text>

//       {/* Detailed Records */}
//       <Text style={styles.sectionTitle}>Detailed Records</Text>
//       {/* Roll Call Summaries */}
// <Text style={styles.sectionTitle}>Attendance by Roll Call</Text>
// {attendanceData?.rollCallSummaries.map((rc) => (
//   <TouchableOpacity
//     key={rc.rollCallId}
//     style={styles.rollCallCard}
//     onPress={() => {
//       const students = attendanceData.detailedRecords.filter(
//         s => s.rollCallId === rc.rollCallId
//       );
//       setSelectedRollCall({
//         rollCallId: rc.rollCallId,
//         students
//       });
//     }}
//   >
//     <View>
//       <Text style={styles.rollCallDate}>{rc.date} • {rc.time}</Text>
//       <Text style={styles.rollCallStats}>
//         {rc.presentCount} of {rc.totalStudents} present
//       </Text>
//     </View>
//     <Text style={styles.chevron}>▶</Text>
//   </TouchableOpacity>
// ))}

// {/* Modal / Bottom Sheet for Student List */}

// {/* if (!attendanceData) return <Text>Loading...</Text>; */}
// {selectedRollCall && (
//   <View style={styles.modalOverlay}>
//     <View style={styles.modalContent}>
//       <Text style={styles.modalTitle}>
//         Attendance for Roll Call #{selectedRollCall.rollCallId}
//       </Text>

//       {selectedRollCall.students.length > 0 ? (
//         selectedRollCall.students.map((record, idx) => (
//           <View key={idx} style={styles.recordRow}>
//             <View style={styles.studentInfo}>
//               <Text style={styles.studentName}>{record.studentName}</Text>
//               <Text style={styles.rollNumber}>ID: {record.rollNumber}</Text>
//             </View>
//             <View
//               style={[
//                 styles.statusBadge,
//                 statusBadgeStyles[record.status.toLowerCase() as 'present' | 'absent' | 'late']
//               ]}
//             >
//               <Text style={styles.statusText}>{record.status}</Text>
//             </View>
//             <Text style={styles.time}>{record.submittedAt || '-'}</Text>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.emptyMessage}>
//           {selectedRollCall.students.length === 0 ? 'No students recorded.' : 'Loading...'}
//         </Text>
//       )}

//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={() => setSelectedRollCall(null)}
//       >
//         <Text style={styles.closeButtonText}>Close</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// )}

//       {/* Back Button */}
//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <Text style={styles.backButtonText}>← Back to Dashboard</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   emptyMessage: {
//   fontSize: 16,
//   color: '#888',
//   textAlign: 'center',
//   padding: 20,
// },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#1976D2',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   chartContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   legend: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   bold: {
//     fontWeight: 'bold',
//     color: '#1976D2',
//   },
//   recordRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   studentInfo: {
//     flex: 1,
//   },
//   studentName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   rollNumber: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     minWidth: 60,
//     alignItems: 'center',
//   },
//   present: {
//     backgroundColor: '#d1f7d1',
//     borderColor: '#3cb371',
//   },
//   absent: {
//     backgroundColor: '#ffd6d6',
//     borderColor: '#ff6b6b',
//   },
//   late: {
//     backgroundColor: '#fff3cd',
//     borderColor: '#ffc107',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   time: {
//     fontSize: 14,
//     color: '#666',
//   },
//   backButton: {
//     marginTop: 20,
//     marginBottom:20,
//     padding: 15,
//     backgroundColor: '#1976D2',
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   backButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   datePickerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
// },
// datePickerContainer: {
//     width: '48%',
// },
// dateLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
// },
// dateButton: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     alignItems: 'center',
//     backgroundColor: '#fff',
// },
// fetchButton: {
//     padding: 15,
//     backgroundColor: '#007AFF', // A nice action color
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 20,
// },
// fetchButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
// },
// rollCallCard: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: 16,
//   backgroundColor: '#f0f8ff',
//   borderRadius: 12,
//   marginBottom: 8,
//   borderWidth: 1,
//   borderColor: '#e0e0e0',
// },
// rollCallDate: {
//   fontSize: 16,
//   fontWeight: '600',
//   color: '#1976D2',
// },
// rollCallStats: {
//   fontSize: 14,
//   color: '#555',
// },
// chevron: {
//   color: '#aaa',
//   fontSize: 16,
// },
// modalOverlay: {
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(0,0,0,0.5)',
//   justifyContent: 'flex-end',
//   alignItems: 'center',
// },
// modalContent: {
//   backgroundColor: 'white',
//   width: '100%',
//   maxHeight: '80%',
//   padding: 20,
//   borderTopLeftRadius: 20,
//   borderTopRightRadius: 20,
// },
// modalTitle: {
//   fontSize: 18,
//   fontWeight: 'bold',
//   marginBottom: 15,
//   textAlign: 'center',
// },
// closeButton: {
//   marginTop: 20,
//   padding: 12,
//   backgroundColor: '#f0f0f0',
//   borderRadius: 8,
//   alignItems: 'center',
// },
// closeButtonText: {
//   fontSize: 16,
//   color: '#333',
// },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// 1. Define Interfaces for your data structures
interface StudentAttendanceRecord {
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | string;
  submittedAt: string;
  rollCallId: number;
}

interface RollCallSummary {
  rollCallId: number;
  date: string;
  time: string;
  presentCount: number;
  totalStudents: number;
}

interface AttendanceData {
  last5Days: { date: string; present: number; absent: number }[];
  overallPercentage: number;
  detailedRecords: StudentAttendanceRecord[];
  rollCallSummaries: RollCallSummary[];
}

export default function GetAttendanceScreen() {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [papers, setPapers] = useState<{ paperId: number; name: string }[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null);

  // 2. Apply the Interface to the useState
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);

  const [selectedRollCall, setSelectedRollCall] = useState<{
    rollCallId: number;
    students: StudentAttendanceRecord[];
  } | null>(null);

  const API_URL = Constants.expoConfig?.extra?.API_URL;

  useEffect(() => {
    fetchPapers();
  }, []);

  const statusBadgeStyles = {
    present: styles.present,
    absent: styles.absent,
    late: styles.late,
  };

  const fetchPapers = async () => {
    try {
      console.log("fetching papers");
      const response = await axios.get(`${API_URL}/teacher/papers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setPapers(response.data.papers || []);
      if (response.data.papers.length > 0) {
        setSelectedPaper(response.data.papers[0].paperId);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Fetch papers error:', err);
      Alert.alert('Error', 'Failed to load papers');
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedPaper) return;

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/teacher/get-attendance?paperId=${selectedPaper}&startDate=${start}&endDate=${end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceData(response.data);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch attendance');
      // If error, set null so we don't try to render partial data
      setAttendanceData(null); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPaper != null) {
      fetchAttendance();
    } else {
      setLoading(false);
    }
  }, [selectedPaper]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Handle case where fetch failed or hasn't run yet
  if (!attendanceData) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- FIX: Safely destructure with default values ---
  // This prevents crash if API returns partial object (e.g. missing last5Days)
  const { 
    last5Days = [], 
    rollCallSummaries = [], 
    detailedRecords = [], 
    overallPercentage = 0 
  } = attendanceData;

  const chartData = {
    labels: last5Days.map(d => d.date),
    datasets: [
      {
        data: last5Days.map(d => d.present),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
        label: 'Present',
      },
      {
        data: last5Days.map(d => d.absent),
        color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`,
        strokeWidth: 2,
        label: 'Absent',
      },
    ],
    legend: ['Present', 'Absent'],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>View Attendance</Text>

      {/* Select Paper */}
      <Text style={styles.label}>Select Paper</Text>
      <Picker
        selectedValue={selectedPaper}
        onValueChange={(value) => setSelectedPaper(value)}
        style={styles.picker}
      >
        {papers.map(paper => (
          <Picker.Item key={paper.paperId} label={paper.name} value={paper.paperId} />
        ))}
      </Picker>

      <Text style={styles.label}>Select Date Range</Text>
      <View style={styles.datePickerRow}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
              maximumDate={endDate}
            />
          )}
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>End Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
              minimumDate={startDate}
              maximumDate={new Date()}
            />
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.fetchButton} onPress={fetchAttendance} disabled={loading}>
        <Text style={styles.fetchButtonText}>Get Attendance</Text>
      </TouchableOpacity>

      {/* Last 5 Days Chart */}
      <Text style={styles.sectionTitle}>Last 5 Days Attendance</Text>
      {last5Days.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            showValuesOnTopOfBars={true}
            fromZero={true}
            chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                barPercentage: 0.5,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '6' },
                propsForLabels: { fontSize: 10 }
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
            />
        </View>
      ) : (
          <Text style={styles.emptyMessage}>No chart data for this range.</Text>
      )}
      
      <Text style={styles.legend}>
        Overall attendance over period: <Text style={styles.bold}>{overallPercentage.toFixed(1)}%</Text> present.
      </Text>

      {/* Roll Call Summaries */}
      <Text style={styles.sectionTitle}>Attendance by Roll Call</Text>
      {rollCallSummaries.map((rc) => (
        <TouchableOpacity
          key={rc.rollCallId}
          style={styles.rollCallCard}
          onPress={() => {
            // Filter using the safe detailedRecords array
            const students = detailedRecords.filter(
              s => s.rollCallId === rc.rollCallId
            );
            setSelectedRollCall({
              rollCallId: rc.rollCallId,
              students
            });
          }}
        >
          <View>
            <Text style={styles.rollCallDate}>{rc.date} • {rc.time}</Text>
            <Text style={styles.rollCallStats}>
              {rc.presentCount} of {rc.totalStudents} present
            </Text>
          </View>
          <Text style={styles.chevron}>▶</Text>
        </TouchableOpacity>
      ))}

      {/* Modal / Overlay for Student List */}
      {selectedRollCall && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Attendance for Roll Call #{selectedRollCall.rollCallId}
            </Text>

            <ScrollView style={{ maxHeight: 400 }}>
                {selectedRollCall.students.length > 0 ? (
                selectedRollCall.students.map((record, idx) => (
                    <View key={idx} style={styles.recordRow}>
                    <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{record.studentName}</Text>
                        <Text style={styles.rollNumber}>ID: {record.rollNumber}</Text>
                    </View>
                    <View
                        style={[
                        styles.statusBadge,
                        statusBadgeStyles[record.status.toLowerCase() as keyof typeof statusBadgeStyles] || styles.present
                        ]}
                    >
                        <Text style={styles.statusText}>{record.status}</Text>
                    </View>
                    <Text style={styles.time}>{record.submittedAt || '-'}</Text>
                    </View>
                ))
                ) : (
                <Text style={styles.emptyMessage}>
                    No students recorded for this roll call.
                </Text>
                )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedRollCall(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1976D2',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  chartContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  legend: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  rollNumber: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  present: {
    backgroundColor: '#d1f7d1',
    borderColor: '#3cb371',
  },
  absent: {
    backgroundColor: '#ffd6d6',
    borderColor: '#ff6b6b',
  },
  late: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1976D2',
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  datePickerContainer: {
    width: '48%',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fetchButton: {
    padding: 15,
    backgroundColor: '#007AFF', // A nice action color
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  fetchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rollCallCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rollCallDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  rollCallStats: {
    fontSize: 14,
    color: '#555',
  },
  chevron: {
    color: '#aaa',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});