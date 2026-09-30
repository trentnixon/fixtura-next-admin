"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { handleApiError } from "../utils/error-handler";
import {
  PROTECTED_TEMPLATE_PARTICLE_ID,
  TemplateParticle,
  TemplateParticleInput,
  TemplateParticleListResponse,
} from "@/types/template-particle";
import { readParticleRecord, toTemplateParticle } from "./templateParticleRecord";

const ENDPOINT = "/template-particles";

type ParticleRow = Parameters<typeof toTemplateParticle>[0];

function assertCanUnpublish(id: number) {
  if (id === PROTECTED_TEMPLATE_PARTICLE_ID) {
    throw new Error(
      "Particle id 1 must stay published. New accounts are created with that row.",
    );
  }
}

function assertCanDelete(id: number) {
  if (id === PROTECTED_TEMPLATE_PARTICLE_ID) {
    throw new Error(
      "Particle id 1 cannot be deleted. New accounts are created with that row.",
    );
  }
}

export async function fetchTemplateParticles(): Promise<TemplateParticleListResponse> {
  const query = qs.stringify(
    {
      publicationState: "preview",
      sort: ["name:asc"],
      pagination: { page: 1, pageSize: 100 },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    const body = response.data as { data?: ParticleRow[] } | ParticleRow[];
    const rows = Array.isArray(body) ? body : (body.data ?? []);
    return { data: rows.map((row) => toTemplateParticle(row)) };
  } catch (error) {
    handleApiError(error, "fetchTemplateParticles");
  }
}

export async function createTemplateParticle(
  input: TemplateParticleInput,
): Promise<TemplateParticle> {
  try {
    const response = await axiosInstance.post(ENDPOINT, { data: input });
    return readParticleRecord(response.data);
  } catch (error) {
    handleApiError(error, "createTemplateParticle");
  }
}

export async function updateTemplateParticle(
  id: number,
  input: TemplateParticleInput,
): Promise<TemplateParticle> {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, { data: input });
    return readParticleRecord(response.data);
  } catch (error) {
    handleApiError(error, "updateTemplateParticle");
  }
}

export async function setTemplateParticlePublished(
  id: number,
  published: boolean,
): Promise<TemplateParticle> {
  if (!published) assertCanUnpublish(id);

  try {
    const response = await axiosInstance.put(`${ENDPOINT}/${id}`, {
      data: { publishedAt: published ? new Date().toISOString() : null },
    });
    return readParticleRecord(response.data);
  } catch (error) {
    handleApiError(error, "setTemplateParticlePublished");
  }
}

export async function deleteTemplateParticle(id: number): Promise<void> {
  assertCanDelete(id);

  try {
    await axiosInstance.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    handleApiError(error, "deleteTemplateParticle");
  }
}
