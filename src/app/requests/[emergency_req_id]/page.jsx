"use client";
import RequestDetailsPage from "@/components/RequestDeatilsPage";

// Mock function to fetch request details
const getRequestDetails = async (requestId) => {
  // In a real app, this would fetch from your API
  return {
    statusCode: 200,
    message: "Accepted hospitals fetched successfully",
    data: {
      request: {
        location: {
          type: "Point",
          coordinates: [-74.0065, 40.713],
        },
        _id: requestId,
        createdBy: "680fcc0cad15e2b2bbc00553",
        forSelf: true,
        patientName: "John Doe",
        patientPhoneNumber: "+1234567890",
        photo: "",
        acceptedBy: [
          {
            location: {
              type: "Point",
              coordinates: [-74.005974, 40.712776],
            },
            is_ambulance_available: false,
            _id: "6827a04ac6651dd2f13a8276",
            owner: "6827a04ac6651dd2f13a8274",
            name: "Sunrise Medical Center",
            licenseNumber: "LIC-HOSP-9876543210",
            type: "MULTI_SPECIALITY",
            phoneNumbers: [
              {
                label: "primary",
                number: "+1234567890",
                _id: "6827a6126b88a3110e20775a",
              },
              {
                label: "primary",
                number: "+0987654321",
                _id: "6827a6126b88a3110e20775b",
              },
            ],
            bedData: [
              {
                _id: "6827a6126b88a3110e20775e",
                owner: "6827a04ac6651dd2f13a8276",
                type: "General",
                count: 50,
                available: 30,
                createdAt: "2025-05-16T20:54:42.651Z",
                updatedAt: "2025-05-16T20:54:42.651Z",
              },
              {
                _id: "6827a6126b88a3110e207760",
                owner: "6827a04ac6651dd2f13a8276",
                type: "ICCU",
                count: 10,
                available: 5,
                createdAt: "2025-05-16T20:54:42.751Z",
                updatedAt: "2025-05-16T20:54:42.751Z",
              },
            ],
            is_blood_available: true,
            createdAt: "2025-05-16T20:30:02.358Z",
            updatedAt: "2025-05-16T20:54:42.945Z",
            address: {
              _id: "6827a1b00d4a84fbd522befb",
              owner: "6827a04ac6651dd2f13a8276",
              locality: "Jamohan Nagar, Jagamara",
              city: "Bhubaneswar",
              state: "Odisha",
              pincode: "751030",
              updatedAt: "2025-05-16T20:54:42.391Z",
            },
            bloodData: {
              _id: "6827a1b00d4a84fbd522befd",
              owner: "6827a04ac6651dd2f13a8276",
              opos: 10,
              oneg: 5,
              apos: 8,
              aneg: 4,
              bpos: 7,
              bneg: 3,
              abpos: 2,
              abneg: 1,
              updatedAt: "2025-05-16T20:54:42.525Z",
            },
          },
        ],
        finalizedHospital: null,
        status: "accepted",
        is_ambulance_required: true,
        createdAt: "2025-06-07T21:27:03.743Z",
        updatedAt: "2025-06-07T21:27:58.083Z",
        __v: 1,
      },
    },
  };
};

export default async function RequestDetails({ params }) {
  const requestData = await getRequestDetails(params.emergency_req_id);
  return (
    <main className="min-h-screen bg-gray-50">
      <RequestDetailsPage requestData={requestData.data} />
    </main>
  );
}
