import { classes } from '@automapper/classes';
import {
  CamelCaseNamingConvention,
  Converter,
  createMapper,
} from '@automapper/core';

export const mapper = createMapper({
  strategyInitializer: classes(),
  namingConventions: new CamelCaseNamingConvention(),
});

/**
 * Exports date to server known format
 */
export const dateToStringConverter: Converter<Date, string> = {
  convert(source) {
    if (source instanceof Date) {
      // we are returning 2021-10-15
      return `${lz(source.getFullYear())}-${lz(source.getMonth() + 1)}-${lz(
        source.getDate()
      )}`;
      // API Does not return Z at the end of date to be recognized as UTC
      // return source.toISOString().split('T')[0]; // this does not work;
    }

    return '';
  },
};

export const dateStringToStringConverter: Converter<string, string> = {
  convert(source) {
    let item = source.split('T');

    return item[0];
  },
};

export const dateTimeToString: Converter<Date, string> = {
  convert(source) {
    if (source instanceof Date) {
      return `${lz(source.getFullYear())}-${lz(source.getMonth() + 1)}-${lz(
        source.getDate()
      )}T${lz(source.getHours())}:${lz(source.getMinutes())}:${lz(
        source.getSeconds()
      )}`;
    }

    return '';
  },
};

export const dateToTime: Converter<Date, string> = {
  convert(source) {
    if (source instanceof Date) {
      return `${lz(source.getHours())}:${lz(source.getMinutes())}`;
    }

    return '';
  },
};
export const dateToLongTime: Converter<Date, string> = {
  convert(source) {
    if (source instanceof Date) {
      return `${lz(source.getHours())}:${lz(source.getMinutes())}:${lz(
        source.getSeconds()
      )}`;
    }

    return '';
  },
};

function lz(n: number) {
  if (n > 9) {
    return n;
  }

  return '0' + n;
}

export const stringToDateConverter: Converter<string, Date> = {
  convert(source: string) {
    return new Date(source); // draft
  },
};

export const numberToArrayOfObjects: Converter<number, Object[]> = {
  convert(source: number = 0) {
    let result = [];

    for (let i = 0; i < source; i++) {
      result.push({});
    }

    return result;
  },
};

export const stringToFloat: Converter<string, number> = {
  convert(source: string) {
    return parseFloat(source);
  },
};

export const ensureProtocolExistInURLArray: Converter<string[], string[]> = {
  convert(source: string[]) {
    let result = source || [];

    return result.map((url) => {
      return ensureProtocolExistInURLSingle.convert(url);
    });
  },
};

export const ensureProtocolExistInURLSingle: Converter<string, string> = {
  convert(source: string) {
    let result = source;

    if (result.indexOf('https://') === 0) {
      return result;
    }
    if (result.indexOf('http://') === 0) {
      return result.replace('http://', 'https://');
    }

    return 'https://' + result;
  },
};
