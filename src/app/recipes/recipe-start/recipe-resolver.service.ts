import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "../recipe.model";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { Observable } from "rxjs";
import { RecipeService } from "../recipe.service";

@Injectable({
    providedIn: 'root'
})
export class RecipeResolveService implements Resolve<Recipe[]> {

    constructor(private dataStorage: DataStorageService, private recipeService: RecipeService){}
   
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipeService.getRecipes();

        if(recipes.length === 0){
            return this.dataStorage.fetchRecipes();
        } else {
            return recipes;
        }
    }
} 