"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import MPNavbar from "@/components/mp-navbar";

export default function marketplace(){
    return(
        <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/privacypolicy" />
    );
}