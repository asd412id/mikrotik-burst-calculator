export interface SpeedRates {
  speedUpload: string;
  speedDownload: string;
  bonusUpload: string;
  bonusDownload: string;
  bonusUploadDuration: number;
  bonusDownloadDuration: number;
}

export interface CalculatedRates {
  maxUploadLimit: number;
  maxDownloadLimit: number;
  burstUploadLimit: number;
  burstDownloadLimit: number;
  burstUploadThreshold: number;
  burstDownloadThreshold: number;
  burstTimeUpload: number;
  burstTimeDownload: number;
  limitAtUpload: number;
  limitAtDownload: number;
}

function parseSpeedValue(value: string): number {
  const parsedValue = parseInt(value, 10);
  const unit = value.replace(/\d+/g, '');

  switch (unit.toLowerCase()) {
    case 'k':
      return parsedValue;
    case 'm':
      return parsedValue * 1000;
    case 'g':
      return parsedValue * 1000 * 1000;
    default:
      return parsedValue;
  }
}

function getBurstThreshold(maxLimit: number): number {
  return Math.round(maxLimit * 3 / 4);
}

function getBurstTime(burstLimit: number, interval: number, burstThreshold: number): number {
  return Math.round((burstLimit * interval) / burstThreshold);
}

export function convertToString(number: number): string {
  const numberString = number.toString();
  const length = numberString.length;

  if (length < 4) {
    return `${numberString}K`;
  } else if (length < 8) {
    if (numberString.slice(-3) === "000") {
      return `${numberString.slice(0, -3)}M`
    }
    return `${numberString}K`
  } else {
    if (numberString.slice(-3) === "000") {
      return `${numberString.slice(0, -3)}G`
    }
    return `${numberString}M`
  }
}

export function rateLimit(rates: CalculatedRates): string {
  const maxUpload = convertToString(rates.maxUploadLimit)
  const maxDownload = convertToString(rates.maxDownloadLimit)
  const burstUploadLimit = convertToString(rates.burstUploadLimit)
  const burstDownloadLimit = convertToString(rates.burstDownloadLimit)
  const burstUploadThreshold = convertToString(rates.burstUploadThreshold)
  const burstDownloadThreshold = convertToString(rates.burstDownloadThreshold)
  const burstUploadTime = rates.burstTimeUpload
  const burstDownloadTime = rates.burstTimeDownload
  const uploadLimitAt = convertToString(rates.limitAtUpload)
  const downloadLimitAt = convertToString(rates.limitAtDownload)

  return `${maxUpload}/${maxDownload} ${burstUploadLimit}/${burstDownloadLimit} ${burstUploadThreshold}/${burstDownloadThreshold} ${burstUploadTime}/${burstDownloadTime} 8 ${uploadLimitAt}/${downloadLimitAt}`
}

export function calculateRates(rates: SpeedRates): CalculatedRates {
  const { speedUpload, speedDownload, bonusUpload, bonusDownload, bonusUploadDuration, bonusDownloadDuration } = rates;

  const maxUploadLimit = parseSpeedValue(speedUpload);
  const maxDownloadLimit = parseSpeedValue(speedDownload);
  const burstUploadLimit = parseSpeedValue(bonusUpload);
  const burstDownloadLimit = parseSpeedValue(bonusDownload);
  const burstUploadThreshold = getBurstThreshold(parseSpeedValue(speedUpload));
  const burstDownloadThreshold = getBurstThreshold(parseSpeedValue(speedDownload));
  const burstTimeUpload = getBurstTime(parseSpeedValue(bonusUpload), bonusUploadDuration, burstUploadThreshold);
  const burstTimeDownload = getBurstTime(parseSpeedValue(bonusDownload), bonusDownloadDuration, burstDownloadThreshold);
  const limitAtUpload = Math.round(maxUploadLimit * (1 / 3));
  const limitAtDownload = Math.round(maxDownloadLimit * (1 / 3));

  return {
    maxUploadLimit,
    maxDownloadLimit,
    burstUploadLimit,
    burstDownloadLimit,
    burstUploadThreshold,
    burstDownloadThreshold,
    burstTimeUpload,
    burstTimeDownload,
    limitAtUpload,
    limitAtDownload,
  };
}