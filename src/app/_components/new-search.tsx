"use client";

import {api} from "@/trpc/react";
import {type QueryResult, type Result} from "@/utils/searchTypes";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

import {Card, CardBody, CardHeader, Image} from "@nextui-org/react";

import {IsSecure} from "@/app/_components/secure";
import {hexHash} from "next/dist/shared/lib/hash";

function Result(result: Result) {
    return (
        <a className="flex flex-col gap-3" href={result.url} target="_blank" rel="noopener noreferrer" style={{
            width: "100%",
            maxWidth: "800px",
        }}>
            <Card isBlurred isHoverable={true} isPressable={true} className="space-y-5 p-4" radius="lg" shadow={"sm"}>
                <CardHeader className="pb-0 pt-2 px-4 flex flex-row justify-between items-start gap-3">
                    <div className="flex flex-row gap-3 items-start">
                        <Image
                            src={result.profile.img}
                            alt={result.profile.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                            style={{
                                maxWidth: "40px",
                            }}
                        />
                        <div className="flex-col gap-2 items-start" style={{
                            textAlign: "left"
                        }}>
                            <p className="text-lg font-semibold">{result.title}</p>
                            <div className={"text-small text-default-500"}>
                                {result.meta_url.hostname + result.meta_url.path.trim()}
                            </div>
                        </div>
                    </div>

                    <IsSecure secure={result.meta_url.scheme === "https"} width={15}/>
                </CardHeader>

                <CardBody className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <div dangerouslySetInnerHTML={{__html: result.description}}/>
                    </div>
                </CardBody>
            </Card>
        </a>
    )
}

export function SearchBox() {
    const searchParams = useSearchParams();
    const urlQuery = searchParams?.get("query") ?? "";

    const [query, setQuery] = useState(urlQuery);
    const [enabled, setEnabled] = useState(urlQuery.length > 0);
    const [searchEnabled, setSearchEnabled] = useState(urlQuery.length > 0);
    // const [previousSearchResults, setPreviousSearchResults] = useState<Result[]>([]);
    const [previousSearchResults, setPreviousSearchResults] = useState<QueryResult>(
        {} as QueryResult
    );

    const pushQuery = api.post.pushQuery.useMutation();
    const searchResults = api.post.getSearchResults.useQuery({query}, {enabled});

    const [prevSearchHash, setPrevSearchHash] = useState(hexHash(JSON.stringify(searchResults)));

    const router = useRouter();

    useEffect(() => {
        setEnabled(false);

        if (searchResults?.data?.web.results) {
            // setPreviousSearchResults(searchResults.data.web.results);
            setPreviousSearchResults(searchResults.data);
            const newSearchHash = hexHash(JSON.stringify(query));
            setPrevSearchHash(newSearchHash);
        }

        setSearchEnabled(true);
    }, [query, searchResults.data, searchResults.data?.web.results]);

    const submitQuery = () => {
        setEnabled(true);

        // Push the query to the database
        pushQuery.mutate({query});
        router.push("?query=" + query);
    };

    return (
        <div style={{
            maxWidth: "800px",
            width: "100%",
            paddingTop: "5px"
        }}>
            <Card isBlurred isHoverable={false} className="space-y-5 p-4"
                  radius="lg" shadow={"sm"} style={{
                width: "100%"
            }}>
                <CardHeader className="pb-0 pt-2 px-4 flex flex-col justify-between items-center gap-3">
                    <h1 className="z-20 text-5xl font-extrabold tracking-tight sm:text-[5rem] pb-5">
                        pSearch
                    </h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            const newSearchHash = hexHash(JSON.stringify(query));
                            if (newSearchHash != prevSearchHash) {
                                setSearchEnabled(false);
                                setPrevSearchHash(newSearchHash);
                                submitQuery();
                            }
                        }}
                        className="flex flex-col gap-2"
                        style={{
                            width: "100%",
                            maxWidth: "800px",
                        }}
                    >
                        <div className={"flex flex-row gap-2 flex-item"}>
                            <Input
                                id="search-query"
                                placeholder="Search Query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                color="secondary"
                            />

                            <Button color="secondary" type="submit" className={"flex-item"} isLoading={!searchEnabled}
                                    disabled={!searchEnabled}>Search</Button>
                        </div>
                    </form>
                </CardHeader>
            </Card>
            <br></br>

            {previousSearchResults.web?.results && (
                <div className={"flex flex-col gap-4"}>
                    {
                        previousSearchResults.web.results.map(
                            (result, index) => (
                                <Result key={index} {...result} />
                            )
                        )
                    }
                </div>
            )}
        </div>
    );
}
