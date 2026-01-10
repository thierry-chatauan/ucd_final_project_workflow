import { apiClient } from "./apiClient";

export function fetchJobs() {
  return apiClient("/api/jobs/");
}

export function createJob(payload) {
  return apiClient("/api/jobs/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function finishJob(jobId) {
  return apiClient(`/api/jobs/${jobId}/finish/`, {
    method: "POST",
  });
}

export function deleteJob(jobId) {
  return apiClient(`/api/jobs/${jobId}/`, {
    method: "DELETE",
  });

}
export function EditJobPage(jobId){
  return apiClient(`/api/jobs/${jobId}/`, {
    method: "PUT",
})}


export function updateJob(jobId, payload) {
  return apiClient(`/api/jobs/${jobId}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
} 
export function getJob(jobId) {
  return apiClient(`/api/jobs/${jobId}/`);
} 