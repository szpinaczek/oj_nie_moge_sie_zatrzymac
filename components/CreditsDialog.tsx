import { getTranslation } from "@/app/i18n/translations";
import { Language } from "@/types/map";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Bookmark, Table, Link } from "lucide-react";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";
import { TableBody, TableRow, TableCell } from "./ui/table";

interface CreditsDialogProps {
  language: Language;
}

const CreditsDialog: React.FC<CreditsDialogProps> = ({ language }) => {
  return (
    <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-brown-700 dark:text-brown-100 border-brown-300 dark:border-brown-600 hover:bg-brown-100 dark:hover:bg-brown-700">
                        <Bookmark className="mr-2 h-4 w-4" />
                        {getTranslation('aboutAuthors', language) || 'Credits'}
                      </Button>
                    </DialogTrigger>
                  <CreditsDialog language={language}/>
                    <DialogContent
                      className="sm:max-w-[425px] bg-brown-50 dark:bg-brown-800 text-brown-900 dark:text-brown-100"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                      <DialogHeader>
                        <DialogTitle className="sans-serif text-center mb-3">{getTranslation('authors', language)}</DialogTitle>
                        <DialogDescription className="text-brown-700 dark:text-brown-300">
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorDirector', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                    <Link
                                      className="featured-link"
                                      href="https://culture.pl/pl/tworca/zbigniew-rybczynski"
                                      target="_blank"
                                    >
                                      Zbigniew Rybczyński
                                    </Link> :
                                    <Link
                                    className="featured-link"
                                    href="https://culture.pl/en/artist/zbigniew-rybczynski"
                                    target="_blank"
                                    >
                                      Zbigniew Rybczyński
                                    </Link>}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorMusic', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ? 
                                  <Link
                                    className="featured-link"
                                    href="https://pl.wikipedia.org/wiki/Janusz_Hajdun"
                                    target="_blank"
                                  >
                                    Janusz Hajdun
                                  </Link> :
                                    'Janusz Hajdun'}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorSecondDirector', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                  <Link
                                    className="featured-link"
                                    href="https://culture.pl/pl/tworca/hieronim-neumann"
                                    target="_blank"
                                  >
                                    Hieronim Nojman
                                  </Link> :
                                    'Hieronim Nojman'}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorSecondOperator', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                    <Link
                                      className="featured-link"
                                      href="https://filmpolski.pl/fp/index.php?osoba=1114024"
                                      target="_blank"
                                      >
                                        Janusz Olszewski
                                    </Link> :
                                    <Link
                                      className="featured-link"
                                      href="https://www.imdb.com/name/nm2590520"
                                      target="_blank"
                                      >
                                        Janusz Olszewski
                                    </Link>}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorProducer', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                    <Link
                                      className="featured-link"
                                      href="https://filmpolski.pl/fp/index.php?osoba=1123409"
                                      target="_blank"
                                    >
                                      Andrzej Wawrzonowski
                                    </Link> :
                                      'Andrzej Wawrzonowski'}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorSecondProducer', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                    <Link
                                      className="featured-link"
                                      href="https://filmpolski.pl/fp/index.php?osoba=112028"
                                      target="_blank"
                                    >
                                      Zygmunt Smyczek
                                    </Link> :
                                    <Link
                                      className="featured-link"
                                      href="https://www.imdb.com/name/nm4448574"
                                      target="_blank"
                                      >
                                      Zygmunt Smyczek
                                    </Link>}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorSound', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                    <Link 
                                      className="featured-link"
                                      href="https://filmpolski.pl/fp/index.php?osoba=114230"
                                      target="_blank"
                                      >
                                      Mieczysław Janik
                                    </Link> :
                                    <Link
                                      className="featured-link"
                                      href="https://www.imdb.com/name/nm0417614"
                                      target="_blank"
                                    >
                                      Mieczysław Janik
                                    </Link>}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-semibold">{getTranslation('authorEditor', language)}</TableCell>
                                <TableCell>
                                  {language === "pl" ?
                                    <Link
                                    className="featured-link"
                                    href="https://filmpolski.pl/fp/index.php?osoba=11109578"
                                    target="_blank"
                                  >
                                    Barbara Sarnocińska
                                  </Link> :
                                  <Link
                                    className="featured-link"
                                    href="https://www.imdb.com/name/nm1516261"
                                    target="_blank"
                                  >
                                    Barbara Sarnocińska
                                  </Link>}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table> 
                          {/* {getTranslation('filmDescription', language)} */}
                        </DialogDescription>
                      </DialogHeader>
                      {/* <div className="py-4">
                        <p className="text-brown-900 dark:text-brown-100">
                          {getTranslation('filmAwardsValue', language)}
                        </p>
                      </div> */}
                    </DialogContent>
                  </Dialog>
  )
}

export default CreditsDialog