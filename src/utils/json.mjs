import { readFile } from 'fs/promises';

export const loadContractExperimental = async (file) => {
    const { default: json } = await import(`../../build/contracts/${file}.json`, {
        assert: {type: "json"},
    });
    return json;
}

export const loadContract = async (file) => {
    return JSON.parse(
        await readFile(
          new URL(`../../build/contracts/${file}.json`, import.meta.url)
        )
      );
}